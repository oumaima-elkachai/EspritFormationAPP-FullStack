# Étape 1 : Build avec Maven et cache des dépendances
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copier uniquement le pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et compiler
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image finale
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variables d'environnement
ENV SERVER_PORT=8761 \
    SPRING_APPLICATION_NAME=EurekaServer \
    EUREKA_CLIENT_REGISTER_WITH_EUREKA=false \
    EUREKA_CLIENT_FETCH_REGISTRY=false

EXPOSE 8761
ENTRYPOINT ["java","-jar","app.jar"]
