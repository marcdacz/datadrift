package com.datadrift.service;

import com.datadrift.domain.SystemInfo;
import com.datadrift.repository.SystemInfoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

/** Placeholder service for future system info use cases. */
@Service
public class SystemInfoService {

    private final SystemInfoRepository systemInfoRepository;

    public SystemInfoService(final SystemInfoRepository systemInfoRepository) {
        this.systemInfoRepository = systemInfoRepository;
    }

    public List<SystemInfo> findAll() {
        return systemInfoRepository.findAll();
    }
}
