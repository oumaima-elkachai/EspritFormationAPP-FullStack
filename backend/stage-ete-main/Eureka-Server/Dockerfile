# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# ✅ Correction DNS (important pour éviter le "Temporary failure in name resolution")
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf

# Copier les fichiers nécessaires
COPY pom.xml .
COPY src ./src

# ✅ Build sans tests (les tests sont exécutés avant par Jenkins)
RUN mvn -B clean package -DskipTests

# Étape 2 : Image finale
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copier le jar depuis le builder
COPY --from=builder /app/target/*.jar app.jar

# Configuration par défaut
ENV SERVER_PORT=8761 \
    SPRING_APPLICATION_NAME=EurekaServer \
    EUREKA_CLIENT_REGISTER_WITH_EUREKA=false \
    EUREKA_CLIENT_FETCH_REGISTRY=false

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
