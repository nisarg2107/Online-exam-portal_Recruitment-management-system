package com.roima.learn.application.model;

import lombok.*;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int imageId;
    private String imageText;
    private String altText;
    private int imageOrder;
    // order to get the image order

    @ManyToOne(targetEntity = Question.class)
    @JoinColumn(name="question_id")
    private Question question;

    @ManyToOne(targetEntity = Option.class)
    @JoinColumn(name="option_id")
    private Option option;
}
