package com.datadrift.repository;

import com.datadrift.domain.DataSource;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** JPA repository for DataSource. */
public interface DataSourceRepository extends JpaRepository<DataSource, UUID> {

    Optional<DataSource> findByName(final String name);

    boolean existsByName(final String name);

    /** True if another data source (excluding this id) has the given name. */
    boolean existsByNameAndIdNot(final String name, final UUID id);
}
