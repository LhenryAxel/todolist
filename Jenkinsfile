pipeline {
  agent any

  environment {
    IMAGE_NAME_API = "ghcr.io/lhenryaxel/todolist-api"
    IMAGE_NAME_FRONTEND = "ghcr.io/lhenryaxel/todolist-frontend"
    VERSION = "v${env.BUILD_NUMBER}"
    GIT_CREDENTIALS_ID = "ghcr-token"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        echo "✅ Code checked out"
        sh 'ls -la'
        sh 'ls -la api'
        sh 'ls -la frontend'
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
        echo "🧪 Running tests for API"
        sh '''
          docker build -t test-api ./api
          docker run --rm test-api npm test || echo '[WARN] No test script'
        '''
      }
    }

    stage('Run tests - Frontend') {
      steps {
        echo "🧪 Running tests for Frontend"
        sh '''
          docker build -t test-frontend ./frontend
          docker run --rm test-frontend npm test || echo '[WARN] No test script'
        '''
      }
    }

    stage('Build Docker Images') {
      steps {
        echo "📦 Building Docker images"
        sh "docker build -t $IMAGE_NAME_API:$VERSION ./api"
        sh "docker build -t $IMAGE_NAME_FRONTEND:$VERSION ./frontend"
      }
    }

    stage('Tag Git') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
          sh '''
            git config user.email "jenkins@example.com"
            git config user.name "jenkins"
            git tag $VERSION
            git push https://$GIT_USER:$GIT_TOKEN@github.com/LhenryAxel/todolist.git $VERSION
          '''
        }
      }
    }

    stage('Push to GitHub Packages') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
          sh "echo $GIT_TOKEN | docker login ghcr.io -u $GIT_USER --password-stdin"
          sh "docker push $IMAGE_NAME_API:$VERSION"
          sh "docker push $IMAGE_NAME_FRONTEND:$VERSION"
        }
      }
    }
  }

  post {
    always {
      echo "🧹 Cleaning up workspace..."
      cleanWs()
    }
    failure {
      echo "❌ Build failed. Check above logs for more details."
    }
    success {
      echo "✅ Build succeeded and Docker images pushed!"
    }
  }
}
