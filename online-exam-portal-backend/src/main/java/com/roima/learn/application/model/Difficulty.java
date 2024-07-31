package com.roima.learn.application.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import org.hibernate.validator.constraints.UniqueElements;

import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Difficulty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(unique = true)
    @NotEmpty(message = "Level cannot be empty")
    
    private String level;
    
    public void setLevel (String level) {
    	this.level = level.toUpperCase();
    }

    @OneToMany(mappedBy="difficulty", targetEntity = Question.class)
    private Set<Question> questionSet;

    @OneToMany(mappedBy="difficulty", targetEntity = Exam.class)
    private Set<Exam> examSet;
}
