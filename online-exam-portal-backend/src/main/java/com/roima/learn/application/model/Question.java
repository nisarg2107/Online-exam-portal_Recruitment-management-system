package com.roima.learn.application.model;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String description;

//    @ManyToMany
//    @JoinTable(
//            name = "question_category",
//            joinColumns = @JoinColumn(name = "question_id"),
//            inverseJoinColumns = @JoinColumn(name = "category_id"))
//    private Set<Category> categorySet;
    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;

    @OneToMany(mappedBy="question", targetEntity = Image.class)
    private Set<Image> imageSet;

    @OneToMany(mappedBy="question", cascade=CascadeType.ALL, targetEntity = Option.class, orphanRemoval = true)
    private Set<Option> optionSet;

    @ManyToOne
    @JoinColumn(name="difficulty_id")
    private Difficulty difficulty;

    // a question can appear in multiple exams if we have exam sets like (A,B,C,D)
    @OneToMany(mappedBy="question", targetEntity = ExamQuestion.class)
    private Set<ExamQuestion> examQuestionSet;

    private boolean mcq;


    public void setOptionSet(Set<Option> optionSet) {
        this.optionSet.clear();
        this.optionSet.addAll(optionSet);
    }

    public void clearOptionSet() {
        this.optionSet = new HashSet<>();
    }
}
