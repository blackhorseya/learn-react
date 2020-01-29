#!/usr/bin/env groovy

pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:alpine
    command:
    - cat
    tty: true
"""
    }
  }
  stages {
    stage('Prepare') {
      steps {
        echo "branch name: ${env.GIT_BRANCH}"
        sh 'node -v'
        sh 'yarn -v'
        sh 'printenv'
      }
    }

    stage('Build') {
      steps {
        container('node') {
          sh '''
          yarn build
          '''
        }
      }
    }

    stage('Test') {
      steps {
        container('node') {
          echo 'test'
        }
      }
    }
  }
}