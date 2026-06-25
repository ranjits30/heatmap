package com.heatmap.controller;

import com.heatmap.dto.EmployeeDashboardDto;
import com.heatmap.dto.EmployeeSkillRatingDto;
import com.heatmap.entity.Assessment;
import com.heatmap.entity.AssessmentDetail;
import com.heatmap.entity.EmployeeProfile;
import com.heatmap.entity.AssessmentStatus;
import com.heatmap.repository.AssessmentRepository;
import com.heatmap.repository.EmployeeProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EmployeeProfileRepository employeeProfileRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @GetMapping("/employees")
    @Transactional(readOnly = true)
    public List<EmployeeDashboardDto> getEmployees() {
        return employeeProfileRepository.findAll().stream().map(this::toDashboardDto).collect(Collectors.toList());
    }

    private EmployeeDashboardDto toDashboardDto(EmployeeProfile employeeProfile) {
        EmployeeDashboardDto dto = new EmployeeDashboardDto();
        dto.setId(employeeProfile.getId());
        dto.setEmployeeId(employeeProfile.getEmployeeId());
        dto.setName(employeeProfile.getName());
        dto.setDesignation(employeeProfile.getDesignation());
        dto.setDepartment(employeeProfile.getDepartment());
        dto.setLocation(employeeProfile.getLocation());

        List<Assessment> assessments = assessmentRepository
            .findByEmployeeProfileIdAndStatusOrderBySubmittedAtDesc(employeeProfile.getId(), AssessmentStatus.SUBMITTED);
        Assessment latestAssessment = assessments.isEmpty() ? null : assessments.get(0);

        Map<String, Integer> skillRatings = new LinkedHashMap<>();
        Map<String, String> skillCovers = new LinkedHashMap<>();
        if (latestAssessment != null) {
            latestAssessment.getDetails().forEach(detail -> {
                if (detail.getSkill() != null) {
                    skillRatings.put(detail.getSkill().getName(), detail.getRating());
                    skillCovers.put(detail.getSkill().getName(), detail.getRemarks() == null ? "" : detail.getRemarks());
                }
            });
            dto.setSubmittedAt(latestAssessment.getSubmittedAt());
        }

        List<EmployeeSkillRatingDto> topSkills = skillRatings.entrySet().stream()
            .filter(entry -> entry.getKey() != null) 
            .filter(entry -> {
                String normalizedKey = entry.getKey().trim().toLowerCase();
                return !normalizedKey.equals("others") && !normalizedKey.endsWith("_others");
            })
            .sorted((left, right) -> Integer.compare(right.getValue(), left.getValue()))
            .limit(4)
            .map(entry -> new EmployeeSkillRatingDto(entry.getKey(), entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        int totalScore = skillRatings.values().stream().mapToInt(Integer::intValue).sum();
        int ratedSkills = skillRatings.size();
        int maxScore = ratedSkills * 5;
        int percentage = maxScore == 0 ? 0 : Math.round((totalScore * 100.0f) / maxScore);
        double averageScore = ratedSkills == 0 ? 0 : totalScore / (double) ratedSkills;
        int strongSkills = (int) skillRatings.values().stream().filter(score -> score >= 4).count();
        int gapSkills = (int) skillRatings.values().stream().filter(score -> score > 0 && score < 3).count();

        dto.setSkillRatings(skillRatings);
        dto.setSkillCovers(skillCovers);
        dto.setTopSkills(topSkills);
        dto.setTotalScore(totalScore);
        dto.setMaxScore(maxScore);
        dto.setPercentage(percentage);
        dto.setAverageScore(averageScore);
        dto.setRatedSkills(ratedSkills);
        dto.setStrongSkills(strongSkills);
        dto.setGapSkills(gapSkills);
        return dto;
    }
}
