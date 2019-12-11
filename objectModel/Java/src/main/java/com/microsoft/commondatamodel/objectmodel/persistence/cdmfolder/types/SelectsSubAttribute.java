package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

import java.util.List;

public class SelectsSubAttribute {
    private String selects;
    private JsonNode selectedTypeAttribute;
    private List<String> selectsSomeTakeNames;
    private List<String> selectsSomeAvoidNames;

    public String getSelects() {
        return this.selects;
    }

    public void setSelects(final String selects) {
        this.selects = selects;
    }

    public JsonNode getSelectedTypeAttribute() {
        return this.selectedTypeAttribute;
    }

    public void setSelectedTypeAttribute(final JsonNode selectedTypeAttribute) {
        this.selectedTypeAttribute = selectedTypeAttribute;
    }

    public List<String> getSelectsSomeTakeNames() {
        return selectsSomeTakeNames;
    }

    public void setSelectsSomeTakeNames(List<String> selectsSomeTakeNames) {
        this.selectsSomeTakeNames = selectsSomeTakeNames;
    }

    public List<String> getSelectsSomeAvoidNames() {
        return selectsSomeAvoidNames;
    }

    public void setSelectsSomeAvoidNames(List<String> selectsSomeAvoidNames) {
        this.selectsSomeAvoidNames = selectsSomeAvoidNames;
    }
}