/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.PaymentType;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface PaymentTypeRepository extends JpaRepository<PaymentType, Integer>{

}
