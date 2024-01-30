#!/bin/bash

# Set the interval in seconds for how often to log the stats
INTERVAL=5

# Set the log file location
LOG_FILE="system_usage3.log"

# Check if the log file exists, create if it doesn't
if [ ! -f "$LOG_FILE" ]; then
    touch "$LOG_FILE"
fi

# Function to log memory and CPU usage
log_system_usage() {
    echo "Logging system usage to $LOG_FILE"
    while true; do
        # Get the current date and time
        timestamp=$(date "+%Y-%m-%d %H:%M:%S")

        # Get total system memory usage (free command)
        total_memory_usage=$(free -h)

        # Get total system CPU usage (top command)
        total_cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')

        # Get the process memory and CPU usage by Node.js
        node_process_usage=$(ps aux | grep 'node' | awk '{cpu_sum += $3; mem_sum += $4} END {print "CPU: " cpu_sum "%, Memory: " mem_sum "%"}')

        # Log the usage with timestamp
        echo "[$timestamp] System Usage" >> "$LOG_FILE"
        echo "Total System Memory Usage:" >> "$LOG_FILE"
        echo "$total_memory_usage" >> "$LOG_FILE"
        echo "Total System CPU Usage: $total_cpu_usage" >> "$LOG_FILE"
        echo "Node.js Processes Usage: $node_process_usage" >> "$LOG_FILE"
        echo "----------------------------------------" >> "$LOG_FILE"

        # Wait for the specified interval
        sleep "$INTERVAL"
    done
}

# Run the logging function
log_system_usage
