package com.roima.learn.application.controller;

import com.roima.learn.application.payload.StudentExamDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.payload.response.StudentExamResponseDto;
import com.roima.learn.application.service.StudentExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
//@AllArgsConstructor
public class StudentExamController {

    @Autowired
    private StudentExamService studentExamService;

    @GetMapping("/student/exam")
    public ResponseEntity<StudentExamResponseDto> getStudentExams(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {

        return ResponseEntity.ok(this.studentExamService.getStudentExam(pageNumber, pageSize));
    }

    @GetMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<StudentExamDto> getStudentExamByIds(@PathVariable int studentId, @PathVariable int examId) {
        return ResponseEntity.ok(this.studentExamService.getStudentExamById(studentId,examId));
    }

//    The below are not needed as the details cna be fetched from USER AND EXAM

//    @GetMapping("/student/{studentId}/exam")
//    public ResponseEntity<List<ExamDto>> getExamsByStudentId(@PathVariable int studentId) {
//        List<ExamDto> examDtoList = new ArrayList<>(this.studentExamService.getExamByStudentId(studentId));
//        return ResponseEntity.ok(examDtoList);
//    }
//
//    @GetMapping("/student/exam/{examId}")
//    public ResponseEntity<List<UserDto>> getStudentsByExamId(@PathVariable int examId) {
//        List<UserDto> userDtoList = new ArrayList<>(this.studentExamService.getStudentByExamId(examId));
//        return ResponseEntity.ok(userDtoList);
//    }

    @PostMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<StudentExamDto> createStudentExam(@PathVariable int studentId, @PathVariable int examId, @RequestBody StudentExamDto studentExamDto) {
        return new ResponseEntity<>(this.studentExamService.createStudentExam(studentId,examId, studentExamDto), HttpStatus.CREATED);
    }

    @PutMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<StudentExamDto> updateStudentExam(@PathVariable int studentId, @PathVariable int examId, @RequestBody StudentExamDto studentExamDto) {
        return new ResponseEntity<>(this.studentExamService.updateStudentExam(studentId,examId,studentExamDto), HttpStatus.CREATED);
    }

    @PutMapping("/student/{studentId}/exam/{examId}/status")
    public ResponseEntity<StudentExamDto> updateStudentExamStatus(@PathVariable int studentId, @PathVariable int examId, @RequestBody StudentExamDto studentExamDto) {
        return new ResponseEntity<>(this.studentExamService.updateStudentExamStatus(studentId,examId,studentExamDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<ResponseDto> deleteStudentExam(@PathVariable int studentId, @PathVariable int examId) {
        this.studentExamService.deleteStudentExam(studentId,examId);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));

    }
}
