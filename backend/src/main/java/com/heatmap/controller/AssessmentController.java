package com.heatmap.controller;

import com.heatmap.dto.AssessmentSubmissionRequest;
import com.heatmap.dto.AssessmentSubmissionResponse;
import com.heatmap.entity.Assessment;
import com.heatmap.entity.AssessmentDetail;
import com.heatmap.entity.AssessmentStatus;
import com.heatmap.entity.EmployeeProfile;
import com.heatmap.entity.SkillMaster;
import com.heatmap.repository.AssessmentRepository;
import com.heatmap.repository.EmployeeProfileRepository;
import com.heatmap.repository.SkillMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    @Autowired
    private EmployeeProfileRepository employeeProfileRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private SkillMasterRepository skillMasterRepository;

    @PostMapping("/submit")
    @Transactional
    public AssessmentSubmissionResponse submitAssessment(@RequestBody AssessmentSubmissionRequest request) {
        if (request.getEmployeeId() == null || request.getEmployeeId().trim().isEmpty()) {
            throw new IllegalArgumentException("employeeId is required");
        }

        EmployeeProfile profile = employeeProfileRepository.findByEmployeeId(request.getEmployeeId().trim())
            .orElseGet(EmployeeProfile::new);

        profile.setEmployeeId(request.getEmployeeId().trim());
        profile.setName(request.getName() == null ? "" : request.getName().trim());
        profile.setDesignation(request.getDesignation() == null ? "" : request.getDesignation().trim());
        profile.setDepartment(request.getDepartment() == null ? "" : request.getDepartment().trim());
        profile.setLocation(request.getLocation() == null ? "" : request.getLocation().trim());
        profile = employeeProfileRepository.save(profile);

        if (request.getRatings() == null || request.getRatings().isEmpty()) {
            return new AssessmentSubmissionResponse("Profile saved successfully", profile.getId(), null);
        }

        Assessment assessment = new Assessment();
        assessment.setEmployeeProfile(profile);
        assessment.setStartedAt(LocalDateTime.now());
        assessment.setSubmittedAt(LocalDateTime.now());
        assessment.setStatus(AssessmentStatus.SUBMITTED);

        request.getRatings().forEach((skillId, rating) -> {
            SkillMaster skill = skillMasterRepository.findByName(skillId)
                .orElseGet(() -> skillMasterRepository.save(new SkillMaster(skillId, skillId, null)));

            AssessmentDetail detail = new AssessmentDetail();
            detail.setAssessment(assessment);
            detail.setSkill(skill);
            detail.setRating(rating == null ? 0 : rating);
            if (request.getCovers() != null) {
                detail.setRemarks(request.getCovers().getOrDefault(skillId, ""));
            }
            assessment.getDetails().add(detail);
        });

        Assessment savedAssessment = assessmentRepository.save(assessment);
        return new AssessmentSubmissionResponse("Saved successfully", profile.getId(), savedAssessment.getId());
    }
}