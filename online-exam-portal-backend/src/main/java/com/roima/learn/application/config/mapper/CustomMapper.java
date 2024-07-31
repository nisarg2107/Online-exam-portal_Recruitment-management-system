package com.roima.learn.application.config.mapper;

import com.roima.learn.application.model.*;
import com.roima.learn.application.payload.*;
import com.roima.learn.application.payload.simple.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring")
public interface CustomMapper {

    CustomMapper MAPPER = Mappers.getMapper(CustomMapper.class);

//    Exam mapToExam(ExamDto examDto);
    ExamDto mapToExamDto(Exam exam);

    @Mapping(source = "examQuestion.exam.id",target = "id")
    ExamDto mapToExamDto(ExamQuestion examQuestion);
    SimpleExamDto mapToSimpleExamDto(ExamDto examDto);
    SimpleExamDto mapToSimpleExamDto(Exam exam);

//    ExamQuestion mapToExamQuestion(ExamQuestionDto examQuestionDto);
    ExamQuestionDto mapToExamQuestionDto(ExamQuestion examQuestion);

//    Question mapToQuestion(QuestionDto questionDto);
    QuestionDto mapToQuestionDto(Question question);

    @Mapping(source = "examQuestion.question.id",target = "id")
    QuestionDto mapToQuestionDto(ExamQuestion examQuestion);

    SimpleQuestionDto mapToSimpleQuestionDto(Question question);
    SimpleQuestionDto mapToSimpleQuestionDto(QuestionDto questionDto);

    CategoryDto mapToCategoryDto(Category category);
    SimpleCategoryDto mapToSimpleCategoryDto(Category category);
    SimpleCategoryDto mapToSimpleCategoryDto(CategoryDto categoryDto);

    DifficultyDto mapToDifficultyDto(Difficulty difficulty);
//    DifficultyDto mapToDifficultyDto(DifficultyDto difficultyDto);
    SimpleDifficultyDto mapToSimpleDifficultyDto(Difficulty difficulty);
    SimpleDifficultyDto mapToSimpleDifficultyDto(DifficultyDto difficultyDto);

    OptionDto mapToOptionDto(Option option);
    SimpleOptionDto mapToSimpleOptionDto(Option option);
    SimpleOptionDto mapToSimpleOptionDto(OptionDto optionDto);

    ImageDto mapToImageDto(Image image);
    SimpleImageDto mapToSimpleImageDto(Image image);
    SimpleImageDto mapToSimpleImageDto(ImageDto imageDto);

    // user and student are same
    UserDto mapToUserDto(User user);
    SimpleUserDto mapToSimpleUserDto(User user);
    SimpleUserDto mapToSimpleUserDto(UserDto userDto);

    StudentExamDto mapToStudentExamDto(StudentExam studentExam);
    SimpleStudentExamDto mapToSimpleStudentExamDto(StudentExam studentExam);
    SimpleStudentExamDto mapToSimpleStudentExamDto(StudentExamDto studentExamDto);

    StudentExamQuestionAnswerResponseDto mapToStudentExamQuestionAnswerResponseDto(StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse);

    RoleDto mapToRoleDto(Role role);
    SimpleRoleDto mapToSimpleRoleDto(Role role);
    SimpleRoleDto mapToSimpleRoleDto(RoleDto roleDto);

    /*
    ExamQuestionKey mapToExamQuestionKey(ExamQuestion examQuestion);

    @Mapping(source = "examQuestionDto.exam.id",target = "examId")
    @Mapping(source = "examQuestionDto.question.id",target = "questionId")
    ExamQuestionKey mapToExamQuestionKey(ExamQuestionDto examQuestionDto);





    StudentExamKey mapToStudentExamKey(StudentExam studentExam);


    @Mapping(source = "studentExamDto.user.id",target = "userId")
    @Mapping(source = "studentExamDto.exam.id",target = "examId")
    StudentExamKey mapToStudentExamKey(StudentExamDto studentExamDto);



    StudentExamQuestionAnswerResponseKey mapToStudentExamQuestionAnswerResponseKey(StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse);

    @Mapping(source = "studentExamQuestionAnswerResponseDto.student.id",target = "studentId")
    @Mapping(source = "studentExamQuestionAnswerResponseDto.exam.id",target = "examId")
    @Mapping(source = "studentExamQuestionAnswerResponseDto.question.id",target = "questionId")
    StudentExamQuestionAnswerResponseKey mapToStudentExamQuestionAnswerResponseKey(StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto);

    */
}

