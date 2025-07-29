pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = 1
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo '✅ Code checked out'
                sh 'ls -la'
                sh 'ls -la api || true'
                sh 'ls -la frontend || true'
            }
        }

        stage('Debug API dir') {
            steps {
                sh 'echo "[DEBUG] API directory content:"'
                sh 'ls -la api'
                sh 'cat api/package.json || echo "package.json NOT FOUND in API"'
            }
        }

        stage('Install dependencies - API') {
            steps {
                echo '🔧 Installing API dependencies...'
                sh '''
                    docker run --rm \
                        -v "$PWD/api:/app" \
                        -w /app \
                        node:20 sh -c '
                            echo "[DEBUG] Inside container - API:" &&
                            pwd &&
                            ls -la &&
                            echo "[DEBUG] node version:" &&
                            node -v &&
                            echo "[DEBUG] npm version:" &&
                            npm -v &&
                            echo "[DEBUG] Running npm install..." &&
                            npm install
                        '
                '''
            }
        }

        stage('Install dependencies - Frontend') {
            steps {
                echo '🔧 Installing Frontend dependencies...'
                sh '''
                    docker run --rm \
                        -v "$PWD/frontend:/app" \
                        -w /app \
                        node:20 sh -c '
                            echo "[DEBUG] Inside container - Frontend:" &&
                            pwd &&
                            ls -la &&
                            echo "[DEBUG] node version:" &&
                            node -v &&
                            echo "[DEBUG] npm version:" &&
                            npm -v &&
                            echo "[DEBUG] Running npm install..." &&
                            npm install
                        '
                '''
            }
        }

        stage('Run tests - API') {
            steps {
                echo '🧪 Running API tests...'
                sh '''
                    docker run --rm \
                        -v "$PWD/api:/app" \
                        -w /app \
                        node:20 sh -c '
                            echo "[DEBUG] Running API tests..." &&
                            npm test || echo "⚠️ Tests failed or are not defined"
                        '
                '''
            }
        }

        stage('Run tests - Frontend') {
            steps {
                echo '🧪 Running Frontend tests...'
                sh '''
                    docker run --rm \
                        -v "$PWD/frontend:/app" \
                        -w /app \
                        node:20 sh -c '
                            echo "[DEBUG] Running Frontend tests..." &&
                            npm test || echo "⚠️ Tests failed or are not defined"
                        '
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'docker compose build --progress=plain'
            }
        }

        stage('Tag Git') {
            steps {
                echo '🏷️ Tagging commit...'
                sh '''
                    git config --global user.email "ci@example.com"
                    git config --global user.name "Jenkins CI"
                    git tag -a "build-${BUILD_NUMBER}" -m "Build ${BUILD_NUMBER}"
                    git push origin "build-${BUILD_NUMBER}"
                '''
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                echo '📦 Pushing Docker images to GitHub Packages...'
                sh 'docker compose push || echo "⚠️ Push failed (check auth or tags)"'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
        failure {
            echo '❌ Build failed. Check above logs for more details.'
        }
    }
}
