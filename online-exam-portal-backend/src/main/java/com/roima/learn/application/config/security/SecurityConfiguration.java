package com.roima.learn.application.config.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {"/auth/**"};
    private static final String[] USER_WHITE_LIST_URL = {
            "/student/{studentId}/exam/{examId}"
    };

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserSecurity userSecurity) throws Exception {
        http
                .cors()
                .and()
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .authorizeHttpRequests(req ->
                        req.antMatchers(WHITE_LIST_URL)
                                .permitAll()
                                .antMatchers(HttpMethod.POST, USER_WHITE_LIST_URL)
                                    .access(userSecurity)
                                .antMatchers(HttpMethod.PUT, "/user/{userId}")
                                    .access(userSecurity)
                                .antMatchers(HttpMethod.GET, "/user/{userId}")
                                    .access(userSecurity)
                                .antMatchers(HttpMethod.GET, "/exam/{examId}")
                                    .hasAnyRole("ADMIN","USER")
                                .antMatchers(HttpMethod.GET, "/student/{studentId}/exam/{examId}/question/{questionId}")
                                    .hasAnyRole("ADMIN","USER")
                                .antMatchers(HttpMethod.GET, "/student/{studentId}/exam/{examId}/question")
                                    .hasAnyRole("ADMIN","USER")
                                .antMatchers(HttpMethod.PUT, "/student/{studentId}/exam/{examId}")
                                    .hasAnyRole("ADMIN","USER")
                                .antMatchers(HttpMethod.PUT, "/student/{studentId}/exam/{examId}/question/{questionId}")
                                    .hasAnyRole("ADMIN","USER")
                                .anyRequest()
                                    .hasRole("ADMIN")
                )


                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//        .addFilterBefore(unauthorizedHandler);
//                .addFilter(new JwtFilter(authenticationManager(), exceptionResolver));

        return http.build();
    }
}

