package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Difficulty;
import com.roima.learn.application.payload.DifficultyDto;
import com.roima.learn.application.payload.response.DifficultyResponseDto;
import com.roima.learn.application.repository.DifficultyRepository;
import com.roima.learn.application.service.DifficultyService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DifficultyServiceImpl implements DifficultyService {

    @Autowired
    private DifficultyRepository difficultyRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public DifficultyResponseDto getDifficulty(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Difficulty> pageDifficulty = this.difficultyRepository.findAll(pageable);

        List<DifficultyDto> difficultyDtoList = pageDifficulty
                .getContent()
                .stream()
//                .map(difficulty -> this.modelMapper.map(difficulty,DifficultyDto.class))
                .map(CustomMapper.MAPPER::mapToDifficultyDto)
                .collect(Collectors.toList());

        DifficultyResponseDto difficultyResponseDto = new DifficultyResponseDto();
        difficultyResponseDto.setContent(difficultyDtoList);
        difficultyResponseDto.setPageNumber(pageNumber + 1);
        difficultyResponseDto.setPageSize(pageSize);
        difficultyResponseDto.setTotalElements(pageDifficulty.getTotalElements());
        difficultyResponseDto.setTotalPages(pageDifficulty.getTotalPages());
        difficultyResponseDto.setLastPage(pageDifficulty.isLast());
        return difficultyResponseDto;
    }

    @Override
    public DifficultyDto getDifficultyById(int id) {
        Difficulty difficulty = this.difficultyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Difficulty not found with id : "+id));
//        return this.modelMapper.map(difficulty,DifficultyDto.class);
        return CustomMapper.MAPPER.mapToDifficultyDto(difficulty);
    }

    @Override
    public DifficultyDto createDifficulty(DifficultyDto difficultyDto) {
        Difficulty difficulty = new Difficulty();
        difficulty.setLevel(difficultyDto.getLevel());
        Difficulty createdDifficulty = this.difficultyRepository.save(difficulty);
//        return this.modelMapper.map(createdDifficulty,DifficultyDto.class);
        return CustomMapper.MAPPER.mapToDifficultyDto(createdDifficulty);
    }

    @Override
    public DifficultyDto updateDifficulty(int id, DifficultyDto difficultyDto) {
        Difficulty difficulty = this.difficultyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Difficulty not found with id : "+id));
        difficulty.setLevel(difficultyDto.getLevel());
        Difficulty updatedDifficulty = this.difficultyRepository.save(difficulty);
//        return this.modelMapper.map(updatedDifficulty,DifficultyDto.class);
        return CustomMapper.MAPPER.mapToDifficultyDto(updatedDifficulty);
    }

    @Override
    public void deleteDifficulty(int id) {
        if (this.difficultyRepository.existsById(id)) this.difficultyRepository.deleteById(id);
        else {
            throw new NoSuchElementException("Difficulty not found with id : " + id);
        }
    }
}
