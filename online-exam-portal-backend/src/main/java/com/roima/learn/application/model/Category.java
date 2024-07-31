package com.roima.learn.application.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(unique = true)
    private String type;

    public void setType(String type) {
		this.type = type.toUpperCase();
	}

	@OneToMany(mappedBy = "category", targetEntity = Question.class)
    private Set<Question> questionSet;
    
}
