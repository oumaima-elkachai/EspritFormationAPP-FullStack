pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-token'
        SONAR_CREDENTIALS  = 'sonar-token'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
        SONAR_HOST = 'http://192.168.6.161:9000'
        IMAGE_NAMESPACE = 'oumaimaelkachai'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: 'https://github.com/oumaima-elkachai/EspritFormationAPP-FullStack.git'
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    def services = ["Eureka-Server","User-Service","Formation-Service"]

                    for (s in services) {
                        dir("backend/stage-ete-main/${s}") {
                            echo "🔍 Running unit tests for ${s}"
                            sh 'mvn -B clean test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: "${SONAR_CREDENTIALS}", variable: 'SONAR_TOKEN')]) {
                    script {
                        def services = [
                            [name: "eureka-server", path: "Eureka-Server"],
                            [name: "user-service", path: "User-Service"],
                            [name: "formation-service", path: "Formation-Service"]
                        ]

                        for (s in services) {
                            dir("backend/stage-ete-main/${s.path}") {
                                sh """
                                mvn -B sonar:sonar \
                                  -Dsonar.projectKey=${s.name} \
                                  -Dsonar.host.url=${SONAR_HOST} \
                                  -Dsonar.token=${SONAR_TOKEN}
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Build Artifacts (.jar)') {
            steps {
                script {
                    def services = ["Eureka-Server", "User-Service", "Formation-Service"]
                    for (s in services) {
                        dir("backend/stage-ete-main/${s}") {
                            echo "⚙️ Building ${s}"
                            sh 'mvn -B clean package -DskipTests'
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "${commit}-${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                        def services = ["Eureka-Server", "User-Service", "Formation-Service"]
                        for (s in services) {
                            def imageName = s.toLowerCase()  // <-- conversion en minuscule
                            sh """
                            docker build -t $DOCKER_USER/${imageName}:${IMAGE_TAG} -t $DOCKER_USER/${imageName}:latest \
                                -f backend/stage-ete-main/${s}/Dockerfile backend/stage-ete-main/${s}
                            docker push $DOCKER_USER/${imageName}:${IMAGE_TAG}
                            docker push $DOCKER_USER/${imageName}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                script {
                    sh '''
                    echo "IMAGE_TAG=${IMAGE_TAG}" > backend/deploy/.env
                    echo "DOCKER_USER=${DOCKER_USER}" >> backend/deploy/.env
                    cd backend/deploy
                    docker-compose pull || true
                    docker-compose up -d --remove-orphans
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/**/target/*.jar', fingerprint: true
        }
    }
}
