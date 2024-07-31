package com.roima.learn.application;

import com.roima.learn.application.model.Role;
import com.roima.learn.application.model.User;
import com.roima.learn.application.repository.RoleRepository;
import com.roima.learn.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DBOperationRunner implements CommandLineRunner {
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired UserRepository userRepository;
    @Autowired RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {

		Role admin = null;
		List<Role> admins = roleRepository.findByTypeContainingIgnoreCase("ROLE_ADMIN");
    	if (admins.isEmpty()) {
    		admin = roleRepository.save(new Role("admin"));
    	}
    	
    	Role user = null;
    	List<Role> users = roleRepository.findByTypeContainingIgnoreCase("ROLE_USER");
		if (users.isEmpty()) {
    		user = roleRepository.save(new Role("user"));
    	}
    	
    	if (!userRepository.existsByEmail("admin@gmail.com")) {
    		userRepository.save(new User("admin","admin@gmail.com",passwordEncoder.encode("Admin@123"),admin));
    	}
    	if (!userRepository.existsByEmail("john@gmail.com")) {
    		userRepository.save(new User("john","john@gmail.com",passwordEncoder.encode("John@123"),user));
    	}

        System.out.println("----------All Data saved into Database----------------------");
    }

}
