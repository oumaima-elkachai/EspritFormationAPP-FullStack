package tn.esprit.spring.formationservice.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;




@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "drdvbbr1d");
        config.put("api_key", "713113157251422");
        config.put("api_secret", "nw4hs1BWT-lCG3jhEs1Cr7Nflds");
        return new Cloudinary(config);
    }
}
