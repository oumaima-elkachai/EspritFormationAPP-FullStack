# Étape 1 : Build Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image finale
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variables d'environnement
ENV SERVER_PORT=9094 \
    SPRING_APPLICATION_NAME=Formation-Service \
    SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/o?createDatabaseIfNotExist=true \
    SPRING_DATASOURCE_USERNAME=root \
    SPRING_DATASOURCE_PASSWORD= \
    EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-service:8761/eureka \
    EUREKA_CLIENT_REGISTER_WITH_EUREKA=true \
    EUREKA_CLIENT_FETCH_REGISTRY=true \
    EUREKA_INSTANCE_PREFER_IPADDRESS=true

EXPOSE 9094
ENTRYPOINT ["java","-jar","app.jar"]
