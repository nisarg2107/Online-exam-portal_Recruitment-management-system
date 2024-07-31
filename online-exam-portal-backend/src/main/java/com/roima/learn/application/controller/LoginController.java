package com.roima.learn.application.controller;

import com.roima.learn.application.config.security.JwtService;
import com.roima.learn.application.model.User;
import com.roima.learn.application.payload.UserDto;
import com.roima.learn.application.payload.response.LoginDto;
import com.roima.learn.application.payload.response.LoginRequest;
import com.roima.learn.application.payload.response.ValidateDto;
import com.roima.learn.application.repository.UserRepository;
import com.roima.learn.application.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginDto> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();

        return new ResponseEntity<>(new LoginDto("Login Successful", jwtService.generateToken(user)), HttpStatus.OK);

    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(this.userService.createUser(userDto),HttpStatus.CREATED);
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidateDto> validate(@RequestBody LoginDto loginDto) {
        String token = loginDto.getToken();
        String userEmail = jwtService.extractUsername(token);
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        User user = this.userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found with emai:" + userEmail));
        String role = jwtService.extractRole(token);

        return new ResponseEntity<>(new ValidateDto(user.getId(),user.getName(),role,jwtService.isTokenValid(token, userDetails)),HttpStatus.OK);
    }

}
