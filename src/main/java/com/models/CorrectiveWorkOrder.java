package com.models;

import java.util.Date;

public class CorrectiveWorkOrder extends WorkOrder {
	private int workOrderId;
	private User completedBy;
	private Date dueDate;
	private MaintenanceRequest maintenanceRequest;

	public CorrectiveWorkOrder() {
		super();
	}

	public CorrectiveWorkOrder(int workOrderId, User completedBy, Date dueDate, MaintenanceRequest maintenanceRequest) {
		super(workOrderId, completedBy, dueDate);
		this.maintenanceRequest = maintenanceRequest;
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

	public MaintenanceRequest getMaintenanceRequest() {
		return maintenanceRequest;
	}

	public void setMaintenanceRequest(MaintenanceRequest maintenanceRequest) {
		this.maintenanceRequest = maintenanceRequest;
	}

	@Override
	public String toString() {
		return "CorrectiveWorkOrder [workOrderId=" + workOrderId + ", completedBy=" + completedBy + ", dueDate="
				+ dueDate + ", maintenanceRequest=" + maintenanceRequest + "]";
	}
	
	
}
