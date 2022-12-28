/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.History;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface HistoryRepository extends JpaRepository<History, Integer>{

}
