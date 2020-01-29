#!/usr/bin/env groovy

pipeline {
  environment {
    PATH = "/root/.dotnet/tools:$PATH"
    APP_NAME = 'learn-dotnet'
    VERSION = "1.0.0.${BUILD_ID}"
    KUBE_NS = "default"
    DOCKERHUB = credentials('docker-hub-credential')
    IMAGE_NAME = "${DOCKERHUB_USR}/${APP_NAME}"
    SONARQUBE_TOKEN = credentials('sonarqube-token')
    SONARQUBE_HOST_URL = "https://sonar.blackhorseya.space"
    KUBE_CONFIG_FILE = credentials('kube-config')
  }
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:alpine
    command: ['cat']
    tty: true
  - name: docker
    image: docker:latest
    command: ['cat']
    tty: true
    volumeMounts:
    - name: dockersock
      mountPath: /var/run/docker.sock
  - name: helm
    image: alpine/helm:3.0.1
    command: ['cat']
    tty: true
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
"""
    }
  }
  stages {
    stage('Prepare') {
      steps {
        container('node') {
            APP_NAME = sh (
                script: 'yarn -s get-name',
                returnStdout: true
            ).trim()
        }
        echo """
Perform ${JOB_NAME} for
Repo: ${env.GIT_URL}
Branch: ${env.GIT_BRANCH}
Application: ${APP_NAME}:${VERSION}
"""
        sh 'printenv'

        container('dotnet-builder') {
            sh 'dotnet --info'
        }

        container('docker') {
            sh 'docker info'
            sh 'docker version'
        }

        container('helm') {
            sh 'helm version'
            sh 'mkdir -p /root/.kube/ && cp $KUBE_CONFIG_FILE /root/.kube/config'
        }
      }
    }

    stage('Build') {
      steps {
        container('dotnet-builder') {
            sh """
            dotnet sonarscanner begin /k:\"${APP_NAME}\" \
            /v:${VERSION} \
            /d:sonar.host.url=${SONARQUBE_HOST_URL} \
            /d:sonar.login=${SONARQUBE_TOKEN} \
            /d:sonar.exclusions=**/*.js,**/*.ts,**/*.css,bin/**/*,obj/**/*,wwwroot/**/*,ClientApp/**/* \
            /d:sonar.cs.opencover.reportsPaths=${PWD}/coverage/coverage.opencover.xml \
            /d:sonar.coverage.exclusions=**/Entities/**/*,test/**/* \
            /d:sonar.cs.vstest.reportsPaths=${PWD}/TestResults/report.trx
            """
            sh 'dotnet build -c Release -o ./publish'
        }
      }
    }

    stage('Test') {
      steps {
        container('dotnet-builder') {
          echo "perform dotnet test and generate test and coverage results"
          sh '''
          dotnet test /p:CollectCoverage=true \
          /p:CoverletOutputFormat=opencover \
          /p:CoverletOutput=$(pwd)/coverage/ \
          --logger trx \
          -r ./TestResults/report.trx \
          -o ./publish \
          --no-build --no-restore
          '''
        }
      }
    }

    stage('Static Code Analysis') {
      steps {
        container('dotnet-builder') {
          sh "dotnet sonarscanner end /d:sonar.login=${SONARQUBE_TOKEN}"
        }
      }
    }

    stage('Build and push docker image') {
        steps {
            container('docker') {
                echo """
IMAGE_NAME: ${IMAGE_NAME}
"""

                sh "docker build -t ${IMAGE_NAME}:latest -f Dockerfile --network host ."
                sh "docker login --username ${DOCKERHUB_USR} --password ${DOCKERHUB_PSW}"
                sh """
                docker push ${IMAGE_NAME}:latest && \
                docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${VERSION} && \
                docker push ${IMAGE_NAME}:${VERSION}
                """
                sh "docker images --filter=reference='${IMAGE_NAME}:*'"
            }
        }
    }

    stage('Deploy') {
      steps {
          container('helm') {
              echo "deploy to dev for latest version"
              sh "helm upgrade --install ${APP_NAME} --namespace=${KUBE_NS} deploy/helm"
          }
      }
    }
  }

  post {
      always {
        script {
          def prefixIcon = currentBuild.currentResult == 'SUCCESS' ? ':white_check_mark:' : ':x:'
          def blocks = [
            [
              "type": "section",
              "text": [
                "type": "mrkdwn",
                "text": "${prefixIcon} *<${BUILD_URL}|${JOB_NAME} #${VERSION}>*"
              ]
            ],
            [
              "type": "divider"
            ],
            [
              "type": "section",
              "fields": [
                [
                  "type": "mrkdwn",
                  "text": "*:star: Build Status:*\n${currentBuild.currentResult}"
                ],
                [
                  "type": "mrkdwn",
                  "text": "*:star: Elapsed:*\n${currentBuild.durationString}"
                ],
                [
                  "type": "mrkdwn",
                  "text": "*:star: Job:*\n<${JOB_URL}|${JOB_NAME}>"
                ],
                [
                  "type": "mrkdwn",
                  "text": "*:star: Project:*\n<${GIT_URL}|Github>"
                ],
                [
                  "type": "mrkdwn",
                  "text": "*:star: Build Image:*\n<https://hub.docker.com/r/${DOCKERHUB_USR}/${APP_NAME}/tags|Docker hub>"
                ]
              ]
            ]
          ]
          slackSend(blocks: blocks)
        }
      }
  }
}