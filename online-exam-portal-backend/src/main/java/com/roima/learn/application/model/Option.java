package com.roima.learn.application.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "options")
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    @OneToMany(mappedBy="option", targetEntity = Image.class)
    private Set<Image> imageSet;

    @ManyToOne(targetEntity = Question.class)
    @JoinColumn(name="question_id")
    private Question question;

    private boolean correct;

    public Option(String name, boolean correct, Question question) {
        this.name = name;
        this.correct = correct;
        this.question = question;
    }
}
