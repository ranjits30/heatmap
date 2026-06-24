package com.heatmap.dto;

public class AssessmentSubmissionResponse {
    private String message;
    private Long employeeProfileId;
    private Long assessmentId;

    public AssessmentSubmissionResponse() {}

    public AssessmentSubmissionResponse(String message, Long employeeProfileId, Long assessmentId) {
        this.message = message;
        this.employeeProfileId = employeeProfileId;
        this.assessmentId = assessmentId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getEmployeeProfileId() {
        return employeeProfileId;
    }

    public void setEmployeeProfileId(Long employeeProfileId) {
        this.employeeProfileId = employeeProfileId;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }
}