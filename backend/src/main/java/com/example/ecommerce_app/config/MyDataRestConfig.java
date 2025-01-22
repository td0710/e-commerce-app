package com.example.ecommerce_app.config;
import com.example.ecommerce_app.entity.Product;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config
    , CorsRegistry corsRegistry) {
        config.exposeIdsFor(Product.class);
    }
}
