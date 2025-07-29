pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('ghcr-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Code checked out"
            }
        }

        stage('Install dependencies - Frontend') {
            steps {
                echo "🔧 Installing Frontend dependencies using docker cp"
                sh '''
                    docker create --name tmp-frontend node:20 sh -c '
                        cd /app &&
                        echo "[DEBUG] In container:" && pwd &&
                        ls -la &&
                        echo "[DEBUG] Node:" && node -v &&
                        echo "[DEBUG] NPM:" && npm -v &&
                        echo "[DEBUG] Running npm install..." &&
                        npm install
                    '
                    docker cp ./frontend/. tmp-frontend:/app
                    docker start -a tmp-frontend
                    docker rm tmp-frontend
                '''
            }
        }

          stage('Run tests - Frontend') {
              steps {
                  echo "🧪 Running frontend tests inside tmp-frontend..."
                  sh '''
                      docker create --name test-frontend node:20 sh -c '
                          cd /app &&
                          npm install &&
                          echo "[DEBUG] Running npm test..." &&
                          npm test
                      '
                      docker cp ./frontend/. test-frontend:/app
                      docker start -a test-frontend
                      docker rm test-frontend
                  '''
              }
          }


        stage('Build Docker Image') {
            steps {
                echo "🐳 Building frontend Docker image..."
                sh '''
                    docker build -t lhenryaxel/todolist-frontend:latest ./frontend
                '''
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                echo "📦 Pushing frontend Docker image..."
                sh '''
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                    docker tag lhenryaxel/todolist-frontend:latest ghcr.io/lhenryaxel/todolist-frontend:latest
                    docker push ghcr.io/lhenryaxel/todolist-frontend:latest
                '''
            }
        }
        
        stage('Tag Git repo') {
          steps {
            withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
              sh '''
                git config user.email "ci@todo.com"
                git config user.name "CI Bot"
                VERSION_TAG="v1.0.${BUILD_NUMBER}"
                git tag -a $VERSION_TAG -m "Build $BUILD_NUMBER"
                git push https://${GIT_USER}:${GIT_PASS}@github.com/LhenryAxel/todolist.git --tags
                echo "📌 Tagged repository with $VERSION_TAG"
              '''
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
    }
}
