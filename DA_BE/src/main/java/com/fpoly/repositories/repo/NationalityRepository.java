/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Nationality;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface NationalityRepository extends JpaRepository<Nationality, Integer>{

}
