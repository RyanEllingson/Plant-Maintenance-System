package com.models;

public class Process {
	private int processId;
	private String processName;
	
	public Process() {
		super();
	}

	public Process(int processId, String processName) {
		super();
		this.processId = processId;
		this.processName = processName;
	}

	public int getProcessId() {
		return processId;
	}

	public void setProcessId(int processId) {
		this.processId = processId;
	}

	public String getProcessName() {
		return processName;
	}

	public void setProcessName(String processName) {
		this.processName = processName;
	}

	@Override
	public String toString() {
		return "Process [processId=" + processId + ", processName=" + processName + "]";
	}
	
}
