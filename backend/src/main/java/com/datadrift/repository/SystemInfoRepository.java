package com.datadrift.repository;

import com.datadrift.domain.SystemInfo;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** Placeholder repository for SystemInfo entity. */
public interface SystemInfoRepository extends JpaRepository<SystemInfo, UUID> {

    Optional<SystemInfo> findByKey(final String key);
}
