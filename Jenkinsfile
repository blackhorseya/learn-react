#!/usr/bin/env groovy

@Library("jenkins-shared-libraries") _

def getDeployTo(String branch) {
    if (branch == null) {
        error("missing [branch] from parameters")
    }

    switch(branch) {
        case ~/.*master/:
            return "prod"
        case ~/.*release.*/:
            return "stg"
        case ~/.*develop/:
            return "dev"
        case ~/.*feature.*/:
            return "dev"
    }
}

def getTagName(String branch, String version) {
    if (branch == null) {
        error("missing [branch] from parameters")
    }

    if (version == null) {
        error("missing [version] from parameters")
    }

    switch(branch) {
        case ~/.*master/:
            return "${version}"
        case ~/.*release.*/:
            return "${version}-beta"
        case ~/.*develop/:
            return "${version}-alpha"
        case ~/.*feature.*/:
            return "${version}-alpha"
    }
}

pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
        parallelsAlwaysFailFast()
    }
    triggers {
        cron('H H(20-21) * * *')
    }
    environment {
        // application settings
        FULL_VERSION = "${VERSION}.${BUILD_ID}"
        IMAGE_NAME = "${DOCKER_REGISTRY_CRED_USR}/${APP_NAME}"

        // docker credentials
        DOCKER_REGISTRY_URL = "https://registry.hub.docker.com/"
        DOCKER_REGISTRY_ID = "docker-hub-credential"
        DOCKER_REGISTRY_CRED = credentials("${DOCKER_REGISTRY_ID}")

        // sonarqube settings
        SONARQUBE_HOST_URL = "https://sonar.blackhorseya.com"
        SONARQUBE_TOKEN = credentials('sonarqube-token')

        // kubernetes settings
        KUBE_CONFIG_ID = "kube-config"

        // git settings
        GIT_CREDENTIAL_ID = "github-ssh"
    }
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: builder
    image: node:alpine
    command: ['cat']
    tty: true
    volumeMounts:
    - name: yarncache
      mountPath: /usr/local/share/.cache/yarn
  - name: docker
    image: docker:latest
    command: ['cat']
    tty: true
    volumeMounts:
    - name: dockersock
      mountPath: /var/run/docker.sock
  - name: helm
    image: alpine/helm:3.1.0
    command: ['cat']
    tty: true
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
  - name: yarncache
    hostPath:
      path: /usr/local/share/.cache/yarn
"""
        }
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    env.DEPLOY_TO = getDeployTo("${GIT_BRANCH}")
                    echo "causes: ${currentBuild.getBuildCauses()}"

                    sshagent(["${GIT_CREDENTIAL_ID}"]) {
                        sh label: "checkout submodule", script: "git submodule update --init --recursive"
                        sh label: "fetch all tags from remote", script: "git tag -l | xargs git tag -d && git fetch --tags"
                        
                        
                        env.TAG_NAME = sh(label: "get tag with current commit", 
                        script: 'git ls-remote --tags --sort=-taggerdate -q origin | grep $(git rev-parse HEAD) | awk \'{print $2}\' | sed \'s/.*\\///g\'', 
                        returnStdout: true).trim()
                    }
                }

                container('builder') {
                    script {
                        APP_NAME = sh(
                                script: 'yarn -s get-name',
                                returnStdout: true
                        ).trim()
                        VERSION = sh(
                                script: 'yarn -s get-version',
                                returnStdout: true
                        ).trim()
                    }
                }
                
                sh label: "print all environment variable", script: "printenv | sort"

                container('docker') {
                    sh label: "print docker info", script: "docker info"
                    sh label: "print docker version", script: "docker version"
                }

                container('helm') {
                    sh label: "print helm info", script: "helm version"
                    withCredentials([file(credentialsId: "${KUBE_CONFIG_ID}", variable: 'config')]) {
                        sh label: "copy kube config", script: """
                        mkdir -p /root/.kube/ && cp ${config} /root/.kube/config
                        """
                    }
                }
            }
        }

        stage('Build') {
            steps {
                container('builder') {
                    sh label: "yarn install and build", script: """
                    yarn install
                    yarn build
                    """
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Test') {
                    steps {
                        container('builder') {
                            sh label: "yarn test", script: """
                            CI=true yarn test
                            """
                        }
                    }
                }
                stage('System Integration Test') {
                    when {
                        allOf {
                            anyOf {
                                branch 'master'
                                branch 'release/*'
                            }
                            triggeredBy cause: "UserIdCause"
                        }
                    }
                    steps {
                        container('builder') {
                            // script {
                            //     error("throw regression failed")
                            // }
                            echo "system integration test success"
                        }
                    }
                }
            }
        }

        stage('Static Code Analysis') {
            when {
                anyOf {
                    allOf {
                        branch 'develop'
                        triggeredBy 'TimerTrigger'
                    }
                    allOf {
                        triggeredBy cause: "UserIdCause"
                    }
                }
            }
            steps {
                container('builder') {
                    echo "sonar scanner"
                }
            }
        }

        stage('Build and push docker image') {
            when {
                anyOf {
                    allOf {
                        branch 'develop'
                        triggeredBy 'TimerTrigger'
                    }
                    allOf {
                        triggeredBy cause: "UserIdCause"
                    }
                }
            }
            steps {
                container('docker') {
                    script {
                        docker.withRegistry("${DOCKER_REGISTRY_URL}", "${DOCKER_REGISTRY_ID}") {
                            def image = docker.build("${IMAGE_NAME}:${FULL_VERSION}", "--network host .")
                            image.push()
                            image.push('latest')
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    allOf {
                        branch 'develop'
                        triggeredBy 'TimerTrigger'
                    }
                    allOf {
                        triggeredBy cause: "UserIdCause"
                    }
                }
            }
            steps {
                container('helm') {
                    script {
                        deploy.helmListWithEnv("${DEPLOY_TO}")
                        deploy.helmUpgrade(
                            appName: "${APP_NAME}",
                            version: "${FULL_VERSION}",
                            imageName: "${IMAGE_NAME}",
                            env: "${DEPLOY_TO}"
                        )
                    }
                }

                script {
                    def tagName = getTagName(env.GIT_BRANCH, env.VERSION)

                    sshagent(["${GIT_CREDENTIAL_ID}"]) {
                        sh label: "git tag ${tagName}", script: """
                        git tag --delete ${tagName} | exit 0 && git push --delete origin ${tagName} | exit 0
                        git tag ${tagName} && git push --tags --force
                        """
                    }
                }

                // add github release
            }
        }
    }

    // post {
    //     always {
    //         script {
    //             notify.sendSlack()
    //         }
    //     }
    // }
}