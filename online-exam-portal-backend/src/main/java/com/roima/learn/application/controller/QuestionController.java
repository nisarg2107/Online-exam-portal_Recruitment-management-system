package com.roima.learn.application.controller;

import com.roima.learn.application.payload.QuestionDto;
import com.roima.learn.application.payload.response.QuestionResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/question")
//@AllArgsConstructor
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/")
    public ResponseEntity<QuestionResponseDto> getQuestions(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize) {

        return ResponseEntity.ok(this.questionService.getQuestion(pageNumber, pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable int id) {

        return ResponseEntity.ok(this.questionService.getQuestionById(id));
    }

    @PostMapping("/")
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody QuestionDto questionDto) {
        return new ResponseEntity<>(this.questionService.createQuestion(questionDto),HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable int id, @RequestBody QuestionDto questionDto) {
        return new ResponseEntity<>(this.questionService.updateQuestion(id, questionDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteQuestion(@PathVariable int id) {
        this.questionService.deleteQuestion(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
