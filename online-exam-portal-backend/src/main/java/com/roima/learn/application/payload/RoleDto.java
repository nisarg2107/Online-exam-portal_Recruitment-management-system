package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleUserDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class RoleDto {
    private int id;
    private String type;
    private Set<SimpleUserDto> studentSet;
}
