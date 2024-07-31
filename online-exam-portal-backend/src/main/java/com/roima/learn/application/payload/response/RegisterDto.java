package com.roima.learn.application.payload.response;

import com.roima.learn.application.payload.UserDto;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {
    private UserDto userDto;
    private String token;
}
