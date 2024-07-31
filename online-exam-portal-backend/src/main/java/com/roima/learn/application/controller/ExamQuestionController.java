package com.roima.learn.application.controller;

import com.roima.learn.application.payload.ExamQuestionDto;
import com.roima.learn.application.payload.response.ExamQuestionResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.ExamQuestionService;
import com.roima.learn.application.service.ExamService;
import com.roima.learn.application.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
//@AllArgsConstructor
public class ExamQuestionController {

    @Autowired
    private ExamService examService;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private ExamQuestionService examQuestionService;

    @GetMapping("/exam/question")
    public ResponseEntity<ExamQuestionResponseDto> getExamQuestions(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {

        return ResponseEntity.ok(this.examQuestionService.getExamQuestion(pageNumber,pageSize));
    }

    /*

    the below apis are not required as we can fetch those things from the QUESTION AND EXAM APIs themselves

    @GetMapping("/exam/{examId}/question")
    public ResponseEntity<List<QuestionDto>> getQuestionsByExamId(@PathVariable int examId) {
        List<QuestionDto> questionDtoList = new ArrayList<>(this.examQuestionService.getExamQuestionByExamId(examId));
        return ResponseEntity.ok(questionDtoList);
    }

    @GetMapping("/exam/question/{questionId}")
    public ResponseEntity<List<ExamDto>> getExamsByQuestionId(@PathVariable int questionId) {
        List<ExamDto> examDtoList = new ArrayList<>(this.examQuestionService.getExamQuestionByQuestionId(questionId));
        return ResponseEntity.ok(examDtoList);
    }

     */

    @GetMapping("/exam/{examId}/question/{questionId}")
    public ResponseEntity<ExamQuestionDto> getExamQuestionByIds(@PathVariable int examId, @PathVariable int questionId) {
        return ResponseEntity.ok(this.examQuestionService.getExamQuestionById(examId,questionId));
    }

    @PostMapping("/exam/{examId}/question/{questionId}")
    public ResponseEntity<ExamQuestionDto> createExamQuestion(@PathVariable int examId, @PathVariable int questionId, @RequestBody ExamQuestionDto examQuestionDto) {
        return  new ResponseEntity<>(this.examQuestionService.createExamQuestion(examId,questionId,examQuestionDto),HttpStatus.CREATED);
    }

    @PutMapping("/exam/{examId}/question/{questionId}")
    public ResponseEntity<ExamQuestionDto> updateExamQuestion(@PathVariable int examId, @PathVariable int questionId, @RequestBody ExamQuestionDto examQuestionDto) {
        return new ResponseEntity<>(this.examQuestionService.updateExamQuestion(examId,questionId,examQuestionDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/exam/{examId}/question/{questionId}")
    public ResponseEntity<ResponseDto> deleteExamQuestion(@PathVariable int examId, @PathVariable int questionId) {
        this.examQuestionService.deleteExamQuestion(examId,questionId);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }
}
