package com.roima.learn.application.controller;

import com.roima.learn.application.payload.DifficultyDto;
import com.roima.learn.application.payload.response.DifficultyResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.DifficultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/difficulty")
//@AllArgsConstructor
public class DifficultyController {

    @Autowired
    private DifficultyService difficultyService;

    @GetMapping("/")
    public ResponseEntity<DifficultyResponseDto> getDifficulties(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {
        return ResponseEntity.ok(this.difficultyService.getDifficulty(pageNumber,pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DifficultyDto> getDifficultyById(@PathVariable int id) {
        return ResponseEntity.ok(this.difficultyService.getDifficultyById(id));
    }

    @PostMapping("/")
    public ResponseEntity<DifficultyDto> createDifficulty(@RequestBody DifficultyDto difficultyDto) {
//        return ResponseEntity.ok(this.difficultyService.createDifficulty(difficultyDto));
        return new ResponseEntity<>(this.difficultyService.createDifficulty(difficultyDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DifficultyDto> updateDifficulty(@PathVariable int id, @RequestBody DifficultyDto difficultyDto) {
        return new ResponseEntity<>(this.difficultyService.updateDifficulty(id, difficultyDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteDifficulty(@PathVariable int id) {
        this.difficultyService.deleteDifficulty(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
