package com.roima.learn.application.service;

import com.roima.learn.application.payload.DifficultyDto;
import com.roima.learn.application.payload.response.DifficultyResponseDto;

public interface DifficultyService {
    DifficultyResponseDto getDifficulty(int pageNumber, int pageSize);
    DifficultyDto getDifficultyById(int id);
    DifficultyDto createDifficulty(DifficultyDto difficultyDto);
    DifficultyDto updateDifficulty(int id, DifficultyDto difficultyDto);
    void deleteDifficulty(int id);
}
