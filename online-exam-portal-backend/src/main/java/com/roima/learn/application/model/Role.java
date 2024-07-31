package com.roima.learn.application.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "Role")
@NoArgsConstructor
@AllArgsConstructor
//@Data
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String type;

    @OneToMany(mappedBy = "role", targetEntity = User.class)
    private Set<User> studentSet;

    public void setType(String type) {
        if (type.toUpperCase().contains("ROLE_")) {
            this.type = type.toUpperCase();
        }
        else {
            this.type = "ROLE_"+type.toUpperCase();
        }
    }

    public Role (String type) {
        this.setType(type);
    }

}
