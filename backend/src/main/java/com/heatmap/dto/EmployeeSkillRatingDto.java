package com.heatmap.dto;

public class EmployeeSkillRatingDto {
    private String skillId;
    private String skillName;
    private int rating;

    public EmployeeSkillRatingDto() {}

    public EmployeeSkillRatingDto(String skillId, String skillName, int rating) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.rating = rating;
    }

    public String getSkillId() {
        return skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}