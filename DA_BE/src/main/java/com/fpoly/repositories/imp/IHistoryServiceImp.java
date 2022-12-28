/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.History;
import com.fpoly.repositories.irepo.IHistoryService;
import com.fpoly.repositories.repo.HistoryRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IHistoryServiceImp implements IHistoryService {

	@Autowired
	private HistoryRepository hisRepo;

	@Override
	public Iterable<History> findAll() {
		return hisRepo.findAll();
	}

	@Override
	public Optional<History> findById(Integer id) {
		return hisRepo.findById(id);
	}

	@Override
	public History save(History t) {
		return hisRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		hisRepo.deleteById(id);
	}

}
