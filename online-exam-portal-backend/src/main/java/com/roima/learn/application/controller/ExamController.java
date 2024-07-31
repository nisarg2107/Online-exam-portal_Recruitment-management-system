package com.roima.learn.application.controller;

import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.response.ExamResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exam")
//@AllArgsConstructor
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping("/")
    public ResponseEntity<ExamResponseDto> getExams(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {

        return ResponseEntity.ok(this.examService.getExam(pageNumber,pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDto> getExamById(@PathVariable int id) {
        return ResponseEntity.ok(this.examService.getExamById(id));
    }

    @PostMapping("/")
    public ResponseEntity<ExamDto> createExam(@RequestBody ExamDto examDto) {
//        return ResponseEntity.ok(this.examService.createExam(examDto));
        return new ResponseEntity<>(this.examService.createExam(examDto), HttpStatus.CREATED);
    }

    @PostMapping("/generate")
    public ResponseEntity<ExamDto> generateExam(@RequestBody ExamDto examDto) {
//        return ResponseEntity.ok(this.examService.createExam(examDto));
        return new ResponseEntity<>(this.examService.generateExam(examDto), HttpStatus.CREATED);
    }

    @PostMapping("/generate/category")
    public ResponseEntity<ExamDto> generateExamWithCategory(@RequestBody ExamDto examDto) {
//        return ResponseEntity.ok(this.examService.createExam(examDto));
        return new ResponseEntity<>(this.examService.generateExamWithCategory(examDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamDto> updateExam(@PathVariable int id, @RequestBody ExamDto examDto) {
        return new ResponseEntity<>(this.examService.updateExam(id, examDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteExam(@PathVariable int id) {
        this.examService.deleteExam(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
