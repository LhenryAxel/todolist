pipeline {
  agent any

  environment {
    IMAGE_NAME = "ghcr.io/lhenryaxel/todolist"
    VERSION = "v1.${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'ghcr-token', url: 'https://github.com/LhenryAxel/todolist.git'
      }
    }

    stage('Install dependencies - API') {
      steps {
        dir('api') {
          sh 'docker run --rm -v "$(pwd)":/app -w /app node:20 npm install'
        }
      }
    }

    stage('Install dependencies - Frontend') {
      steps {
        dir('frontend') {
          sh 'docker run --rm -v "$(pwd)":/app -w /app node:20 npm install'
        }
      }
    }

    stage('Run tests - API') {
      steps {
        dir('api') {
          sh 'docker run --rm -v "$(pwd)":/app -w /app node:20 npm test'
        }
      }
    }

    stage('Run tests - Frontend') {
      steps {
        dir('frontend') {
          sh 'docker run --rm -v "$(pwd)":/app -w /app node:20 npm run test'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          sh "docker build -t ghcr.io/lhenryaxel/todolist-api:${VERSION} ./api"
          sh "docker build -t ghcr.io/lhenryaxel/todolist-front:${VERSION} ./frontend"
        }
      }
    }

    stage('Tag Git') {
      steps {
        sh "git tag $VERSION && git push origin $VERSION"
      }
    }

    stage('Push to GitHub Packages') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
          sh """
            echo "$TOKEN" | docker login ghcr.io -u $USERNAME --password-stdin
            docker push ghcr.io/lhenryaxel/todolist-api:${VERSION}
            docker push ghcr.io/lhenryaxel/todolist-front:${VERSION}
          """
        }
      }
    }
  }
}
