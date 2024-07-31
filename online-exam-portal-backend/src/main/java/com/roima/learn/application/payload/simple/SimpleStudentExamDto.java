package com.roima.learn.application.payload.simple;

// this class will might be not needed in the future

//@NoArgsConstructor
//@AllArgsConstructor
//@Data
//@Getter
//@Setter
public class SimpleStudentExamDto {
//    private Student student;

//    private Exam exam;
    private int marks;
    private boolean passed;
    private String ipAddress;
    private String macAddress;
    private boolean submitted;

//    @Enumerated(EnumType.STRING)
//    private Status status;
    private String status = "pending";

}
