package com.myprojects.YatrikApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.myprojects.YatrikApp")
public class YatrikAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(YatrikAppApplication.class, args);
	}

}
