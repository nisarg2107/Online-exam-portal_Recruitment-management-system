package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleRoleDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class UserDto {
    private int id;
    private String name;
    private String email;
    private String password;
    private SimpleRoleDto role;
    private boolean active;

    private Set<StudentExamDto> studentExamSet;

    private Set<StudentExamQuestionAnswerResponseDto> studentExamQuestionAnswerResponseSet;
}
