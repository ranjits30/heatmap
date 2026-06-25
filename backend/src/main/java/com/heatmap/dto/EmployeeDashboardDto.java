package com.heatmap.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class EmployeeDashboardDto {
    private Long id;
    private String employeeId;
    private String name;
    private String designation;
    private String department;
    private String location;
    private LocalDateTime submittedAt;
    private Map<String, Integer> skillRatings;
    private Map<String, String> skillCovers;
    private List<EmployeeSkillRatingDto> topSkills;
    private int totalScore;
    private int maxScore;
    private int percentage;
    private double averageScore;
    private int ratedSkills;
    private int strongSkills;
    private int gapSkills;

    public EmployeeDashboardDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Map<String, Integer> getSkillRatings() {
        return skillRatings;
    }

    public void setSkillRatings(Map<String, Integer> skillRatings) {
        this.skillRatings = skillRatings;
    }

    public Map<String, String> getSkillCovers() {
        return skillCovers;
    }

    public void setSkillCovers(Map<String, String> skillCovers) {
        this.skillCovers = skillCovers;
    }

    public List<EmployeeSkillRatingDto> getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(List<EmployeeSkillRatingDto> topSkills) {
        this.topSkills = topSkills;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public int getRatedSkills() {
        return ratedSkills;
    }

    public void setRatedSkills(int ratedSkills) {
        this.ratedSkills = ratedSkills;
    }

    public int getStrongSkills() {
        return strongSkills;
    }

    public void setStrongSkills(int strongSkills) {
        this.strongSkills = strongSkills;
    }

    public int getGapSkills() {
        return gapSkills;
    }

    public void setGapSkills(int gapSkills) {
        this.gapSkills = gapSkills;
    }
}