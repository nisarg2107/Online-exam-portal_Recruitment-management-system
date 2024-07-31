package com.roima.learn.application.payload.simple;


// this call is might be not perfect
// I am making this for Diffculty class as it contains nested object

import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleQuestionDto {
    private int id;
    private String title;
    private String description;
    private boolean mcq;

    private Set<SimpleOptionDto> optionSet;
//    private int imageId;
}
