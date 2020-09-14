package com.models;

import java.util.Date;

public class WorkOrder {
	private int workOrderId;
	private User completedBy;
	private Date dueDate;
	
	public WorkOrder() {
		super();
	}
	
	public WorkOrder(int workOrderId, User completedBy, Date dueDate) {
		super();
		this.workOrderId = workOrderId;
		this.completedBy = completedBy;
		this.dueDate = dueDate;
	}

	public int getWorkOrderId() {
		return workOrderId;
	}

	public void setWorkOrderId(int workOrderId) {
		this.workOrderId = workOrderId;
	}

	public User getCompletedBy() {
		return completedBy;
	}

	public void setCompletedBy(User completedBy) {
		this.completedBy = completedBy;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	@Override
	public String toString() {
		return "WorkOrder [workOrderId=" + workOrderId + ", completedBy=" + completedBy + ", dueDate=" + dueDate + "]";
	}
	
}
