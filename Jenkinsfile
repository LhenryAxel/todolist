pipeline {
  agent any

  environment {
    IMAGE_NAME = "ghcr.io/lhenryaxel/todolist"
    VERSION = "v1.${BUILD_NUMBER}"
    ROOT = "/var/jenkins_home/workspace/todolist-ci"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'ghcr-token', url: 'https://github.com/LhenryAxel/todolist.git'
      }
    }

    stage('Debug API dir') {
      steps {
        sh 'ls -la /var/jenkins_home/workspace/todolist-ci'
        sh 'ls -la /var/jenkins_home/workspace/todolist-ci/api'
      }
    }


    stage('Install dependencies - API') {
      steps {
        echo "🔧 Installing API dependencies using docker cp"
        sh '''
          docker create --name tmp-api node:20 sh -c "
            cd /app &&
            echo '[DEBUG] In container:' && pwd &&
            ls -la &&
            echo '[DEBUG] Node:' && node -v &&
            echo '[DEBUG] NPM:' && npm -v &&
            echo '[DEBUG] Running npm install...' &&
            npm install
          "
          docker cp ./api/. tmp-api:/app
          docker start -a tmp-api || echo '[ERROR] npm install failed'
          docker rm tmp-api
        '''
      }
    }


    stage('Install dependencies - Frontend') {
      steps {
        echo "🔧 Installing Frontend dependencies using docker cp"
        sh '''
          docker create --name tmp-frontend node:20 sh -c "
            cd /app &&
            echo '[DEBUG] In container:' && pwd &&
            ls -la &&
            echo '[DEBUG] Node:' && node -v &&
            echo '[DEBUG] NPM:' && npm -v &&
            echo '[DEBUG] Running npm install...' &&
            npm install
          "
          docker cp ./frontend/. tmp-frontend:/app
          docker start -a tmp-frontend || echo '[ERROR] npm install failed'
          docker rm tmp-frontend
        '''
      }
    }


    stage('Run tests - API') {
      steps {
        sh 'docker run --rm -v $PWD/api:/app -w /app node:20 npm test'
      }
    }

    stage('Run tests - Frontend') {
      steps {
        sh 'docker run --rm -v $PWD/frontend:/app -w /app node:20 npm run test'
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
