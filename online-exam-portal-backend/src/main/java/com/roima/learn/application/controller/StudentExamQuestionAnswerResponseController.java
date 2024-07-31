package com.roima.learn.application.controller;

import com.roima.learn.application.payload.StudentExamQuestionAnswerResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.payload.response.StudentExamQuestionResponseDto;
import com.roima.learn.application.payload.simple.SimpleStudentExamResponseDto;
import com.roima.learn.application.service.StudentExamQuestionAnswerResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
//@AllArgsConstructor
public class StudentExamQuestionAnswerResponseController {
    @Autowired
    private StudentExamQuestionAnswerResponseService studentExamQuestionAnswerResponseService;

    @GetMapping("/student/exam/question")
    public ResponseEntity<StudentExamQuestionResponseDto> getStudentResponses(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize) {

        return ResponseEntity.ok(this.studentExamQuestionAnswerResponseService.getStudentExamQuestionAnswerResponse(pageNumber, pageSize));
    }

    @GetMapping("/student/{studentId}/exam/{examId}/question/{questionId}")
    public ResponseEntity<StudentExamQuestionAnswerResponseDto> getStudentResponseById(@PathVariable int studentId, @PathVariable int examId, @PathVariable int questionId) {
        return ResponseEntity.ok(this.studentExamQuestionAnswerResponseService.getStudentExamQuestionAnswerResponseById(studentId, examId, questionId));
    }

    @GetMapping("/student/{studentId}/exam/question")
    public ResponseEntity<List<StudentExamQuestionAnswerResponseDto>> getStudentResponseByStudentId(@PathVariable int studentId) {
        List<StudentExamQuestionAnswerResponseDto> studentExamQuestionAnswerResponseDtoList = new ArrayList<>(this.studentExamQuestionAnswerResponseService.getStudentExamQuestionAnswerResponseByStudentId(studentId));
        return ResponseEntity.ok(studentExamQuestionAnswerResponseDtoList);
    }

    @GetMapping("/student/exam/{examId}/question")
    public ResponseEntity<List<StudentExamQuestionAnswerResponseDto>> getStudentResponseByExamId(@PathVariable int examId) {
        List<StudentExamQuestionAnswerResponseDto> studentExamQuestionAnswerResponseDtoList = new ArrayList<>(this.studentExamQuestionAnswerResponseService.getStudentExamQuestionAnswerResponseByExamId(examId));
        return ResponseEntity.ok(studentExamQuestionAnswerResponseDtoList);
    }

    @GetMapping("/student/{studentId}/exam/{examId}/question")
    public ResponseEntity<List<SimpleStudentExamResponseDto>> getStudentResponseByStudentIdAndExamId(@PathVariable int studentId, @PathVariable int examId) {
        List<SimpleStudentExamResponseDto> simpleStudentExamResponseDtoList = new ArrayList<>(this.studentExamQuestionAnswerResponseService.getStudentExamQuestionAnswerResponseByStudentIdAndExamId(studentId, examId));
        return ResponseEntity.ok(simpleStudentExamResponseDtoList);
    }

    @GetMapping("/student/exam/question/{questionId}")
    public ResponseEntity<List<StudentExamQuestionAnswerResponseDto>> getStudentResponseByQuestionId(@PathVariable int questionId) {
        List<StudentExamQuestionAnswerResponseDto> studentExamQuestionAnswerResponseDtoList = new ArrayList<>(this.studentExamQuestionAnswerResponseService.getStudentExamQuestionAnswerResponseByQuestionId(questionId));
        return ResponseEntity.ok(studentExamQuestionAnswerResponseDtoList);
    }

    @PostMapping("/student/{studentId}/exam/{examId}/question/{questionId}")
    public ResponseEntity<StudentExamQuestionAnswerResponseDto> createStudentResponses(@PathVariable int studentId, @PathVariable int examId, @PathVariable int questionId, @RequestBody StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto) {
        System.out.println("does this method called ?");
        return new ResponseEntity<>(this.studentExamQuestionAnswerResponseService.createStudentExamQuestionAnswerResponse(studentId,examId,questionId ,studentExamQuestionAnswerResponseDto), HttpStatus.CREATED);
    }

    @PutMapping("/student/{studentId}/exam/{examId}/question/{questionId}")
    public ResponseEntity<StudentExamQuestionAnswerResponseDto> updateStudentResponses(@PathVariable int studentId, @PathVariable int examId, @PathVariable int questionId, @RequestBody StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto) {
        return new ResponseEntity<>(this.studentExamQuestionAnswerResponseService.updateStudentExamQuestionAnswerResponse(studentId, examId, questionId, studentExamQuestionAnswerResponseDto), HttpStatus.CREATED);
    }

    @PutMapping("/student/{studentId}/exam/{examId}/question/{questionId}/marks/{marks}")
    public ResponseEntity<StudentExamQuestionAnswerResponseDto> updateStudentResponseMarks(@PathVariable int studentId, @PathVariable int examId, @PathVariable int questionId, @PathVariable int marks) {
        return new ResponseEntity<>(this.studentExamQuestionAnswerResponseService.checkStudentExamQuestionAnswerManual(studentId, examId, questionId, marks), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}/exam/{examId}/check")
    public ResponseEntity<Set<StudentExamQuestionAnswerResponseDto>> checkStudentResponses(@PathVariable int studentId, @PathVariable int examId) {
        return new ResponseEntity<>(this.studentExamQuestionAnswerResponseService.checkStudentExamQuestionAnswerAutomatic(studentId, examId), HttpStatus.CREATED);
    }

    @DeleteMapping("/student/{studentId}/exam/{examId}/question/{questionId}")
    public ResponseEntity<ResponseDto> deleteStudentResponses(@PathVariable int studentId, @PathVariable int examId, @PathVariable int questionId) {
        this.studentExamQuestionAnswerResponseService.deleteStudentExamQuestionAnswerResponse(studentId, examId, questionId);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
